'use client';

import { TimePicker, TimePickerProps } from 'antd';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import FormField from './FormField';
import dayjs from 'dayjs';

interface FormTimePickerProps<T extends FieldValues> extends Omit<TimePickerProps, 'name'> {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    required?: boolean;
}

export default function FormTimePicker<T extends FieldValues>({
    control,
    name,
    label,
    required,
    ...props
}: FormTimePickerProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
                <FormField label={label} required={required} error={error?.message}>
                    <TimePicker
                        {...field}
                        {...props}
                        value={value ? dayjs(value, 'HH:mm') : null}
                        onChange={(time) => onChange(time ? time.format('HH:mm') : '')}
                        format="HH:mm"
                        status={error ? 'error' : ''}
                        className="w-full"
                    />
                </FormField>
            )}
        />
    );
}
