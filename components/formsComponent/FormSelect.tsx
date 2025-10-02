'use client';
import { Select, SelectProps } from 'antd';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import FormField from './FormField';

interface FormSelectProps<T extends FieldValues> extends Omit<SelectProps, 'name'> {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    required?: boolean;
    error?: string; // ✅ cho phép truyền error bên ngoài dưới dạng string
}

export default function FormSelect<T extends FieldValues>({
    control,
    name,
    label,
    required,
    error: externalError,
    ...props
}: FormSelectProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => {
                // fieldState.error có type FieldError | undefined
                const internalError = fieldState.error?.message;
                const finalError = externalError ?? internalError;

                return (
                    <FormField
                        label={label}
                        error={finalError} // ✅ truyền string luôn
                        required={required}
                    >
                        <Select
                            {...field}
                            {...props}
                            status={finalError ? 'error' : ''}
                            className="w-full"
                        />
                    </FormField>
                );
            }}
        />
    );
}
