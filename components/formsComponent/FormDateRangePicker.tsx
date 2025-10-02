'use client';
import { DatePicker } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import FormField from './FormField';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface FormDateRangePickerProps<T extends FieldValues> extends Omit<RangePickerProps, 'name'> {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    required?: boolean;
}

export default function FormDateRangePicker<T extends FieldValues>({
    control,
    name,
    label,
    required,
    ...props
}: FormDateRangePickerProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
                <FormField label={label} error={error?.message} required={required}>
                    <RangePicker
                        {...field}
                        {...props}
                        value={
                            value && Array.isArray(value) && value.length === 2
                                ? [dayjs(value[0]), dayjs(value[1])]
                                : null
                        }
                        onChange={(dates) => {
                            if (dates) {
                                const formattedDates = [
                                    dates[0]?.format('YYYY-MM-DD'),
                                    dates[1]?.format('YYYY-MM-DD'),
                                ];

                                onChange(formattedDates);
                            } else {
                                onChange(null);
                            }
                        }}
                        status={error ? 'error' : ''}
                        className="w-full"
                        placeholder={['Start Date', 'End Date']}
                        allowClear={true}
                    />
                </FormField>
            )}
        />
    );
}
