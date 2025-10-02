'use client';
import { Input } from 'antd';
import { TextAreaProps } from 'antd/es/input';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import FormField from './FormField';

interface FormTextAreaProps<T extends FieldValues> extends Omit<TextAreaProps, 'name'> {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    required?: boolean;
}

export default function FormTextArea<T extends FieldValues>({
    control,
    name,
    label,
    required,
    ...props
}: FormTextAreaProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState: { error } }) => (
                <FormField label={label} error={error?.message} required={required}>
                    <Input.TextArea {...field} {...props} status={error ? 'error' : ''} />
                </FormField>
            )}
        />
    );
}
