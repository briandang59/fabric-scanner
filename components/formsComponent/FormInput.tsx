'use client';
import { Form, Input, InputProps } from 'antd';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

export interface FormInputProps<T extends FieldValues> extends Omit<InputProps, 'name'> {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    required?: boolean;
    error?: string;
}

export function FormInput<T extends FieldValues>({
    control,
    name,
    label,
    required,
    error,
    ...rest
}: FormInputProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => {
                const errorMessage = error ?? fieldState.error?.message;
                return (
                    <Form.Item
                        label={label}
                        required={required}
                        validateStatus={errorMessage ? 'error' : undefined}
                        help={errorMessage}
                    >
                        <Input {...field} {...rest} status={errorMessage ? 'error' : undefined} />
                    </Form.Item>
                );
            }}
        />
    );
}

export default FormInput;
