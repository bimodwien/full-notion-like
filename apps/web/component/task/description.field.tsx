import { useId } from 'react';
import { FIELD_LABEL } from '@/component/ui/select.styles';
import { INPUT } from '@/component/ui/text.field';

const DESCRIPTION_MAX = 5000;

export function DescriptionField({ defaultValue }: { defaultValue: string }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className={FIELD_LABEL}>
        Description
      </label>
      <textarea
        id={id}
        name="description"
        rows={5}
        maxLength={DESCRIPTION_MAX}
        defaultValue={defaultValue}
        className={`${INPUT} resize-y py-2`}
      />
    </div>
  );
}
