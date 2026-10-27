import { BadRequestException, Injectable } from '@nestjs/common';
import * as Y from 'yjs';
import { PrismaService } from '../prisma/prisma.service';
import { DocumentsService } from './documents.service';

@Injectable()
export class DocumentContentService {
  constructor(
    private prisma: PrismaService,
    private documents: DocumentsService,
  ) {}

  async load(workspaceId: string, documentId: string) {
    await this.documents.findOne(workspaceId, documentId);
    const snapshot = await this.prisma.documentSnapshot.findUnique({
      where: { documentId },
    });
    return {
      state: snapshot ? Buffer.from(snapshot.state).toString('base64') : null,
    };
  }

  async save(workspaceId: string, documentId: string, base64: string) {
    await this.documents.findOne(workspaceId, documentId);
    const incoming = Buffer.from(base64, 'base64');
    const snapshot = await this.prisma.documentSnapshot.findUnique({
      where: { documentId },
    });
    const state = this.merge(snapshot?.state, incoming);
    await this.prisma.documentSnapshot.upsert({
      where: { documentId },
      create: { documentId, state },
      update: { state, updatedAt: new Date() },
    });
  }

  // Merging keeps edits from other tabs that the incoming state hasn't seen.
  // Applying to a Y.Doc also rejects bytes that aren't a Yjs update.
  private merge(stored: Uint8Array | undefined, incoming: Uint8Array) {
    const doc = new Y.Doc();
    try {
      if (stored) Y.applyUpdate(doc, stored);
      Y.applyUpdate(doc, incoming);
    } catch {
      throw new BadRequestException('Content is not a valid document state');
    }
    return new Uint8Array(Y.encodeStateAsUpdate(doc));
  }
}
