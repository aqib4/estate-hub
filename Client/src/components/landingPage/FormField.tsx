import React from "react";
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  useFormContext,
  useFieldArray,
} from "@react-hook-form";

import {
  Box,
  TextField,
  Select as MUISelect,
  MenuItem,
  FormControl,
  FormControlLabel,
  InputLabel,
  FormHelperText,
  Switch as MUISwitch,
  Button,
  IconButton,
  Typography,
  Chip,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

interface FormFieldProps {
  name: string;
  label: string;
  type?:
    | "text"
    | "email"
    | "textarea"
    | "number"
    | "select"
    | "switch"
    | "password"
    | "file"
    | "multi-input";
  placeholder?: string;
  options?: { value: string; label: string }[];
  accept?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  value?: string; // optional external override (kept for parity)
  disabled?: boolean;
  multiple?: boolean;
  isIcon?: boolean;
  initialValue?: string | number | boolean | string[];
}

export const CustomFormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = "text",
  placeholder,
  options,
  accept,
  className,
  inputClassName,
  labelClassName,
  value,
  disabled = false,
  multiple = false,
  isIcon = false,
  initialValue,
}) => {
  const { control } = useFormContext();

  const renderHeaderLabel = () => {
    if (type === "switch") return null; // switch handles its own label
    return (
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
        <Typography
          variant="body2"
          className={labelClassName}
          component="label"
          htmlFor={name}
        >
          {label}
        </Typography>
        {!disabled && isIcon && type !== "file" && type !== "multi-input" && (
          <EditOutlinedIcon fontSize="small" />
        )}
      </Box>
    );
  };

  const renderFormControl = (
    field: ControllerRenderProps<FieldValues, string>,
    error?: string
  ) => {
    const commonTextFieldProps = {
      id: name,
      placeholder,
      fullWidth: true,
      disabled,
      error: !!error,
      helperText: error,
      className: inputClassName,
      inputProps: { "aria-label": label },
    } as const;

    switch (type) {
      case "textarea":
        return (
          <TextField
            {...field}
            {...commonTextFieldProps}
            multiline
            minRows={3}
            // label rendered above via renderHeaderLabel()
          />
        );

      case "select": {
        const isMulti = !!multiple;
        const currentValue =
          (value as any) ??
          field.value ??
          (initialValue as any) ??
          (isMulti ? [] : "");

        return (
          <FormControl fullWidth error={!!error} disabled={disabled} className={inputClassName}>
            <InputLabel id={`${name}-label`} shrink>
              {/* We already show a header label; keep InputLabel for a11y */}
            </InputLabel>
            <MUISelect
              labelId={`${name}-label`}
              id={name}
              multiple={isMulti}
              displayEmpty
              value={currentValue}
              onChange={(e) => field.onChange(e.target.value)}
              renderValue={(selected) => {
                if (!isMulti) {
                  return (selected as string) || placeholder || "";
                }
                const arr = (selected as string[]) || [];
                if (arr.length === 0) return placeholder || "";
                return arr.join(", ");
              }}
            >
              {/* Placeholder row for empty value (single) */}
              {!isMulti && (
                <MenuItem value="" disabled>
                  {placeholder || "Select..."}
                </MenuItem>
              )}
              {options?.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </MUISelect>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );
      }

      case "switch":
        return (
          <FormControl fullWidth error={!!error} disabled={disabled} className={inputClassName}>
            <FormControlLabel
              control={
                <MUISwitch
                  checked={!!field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
              label={label}
            />
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );

      case "file": {
        // Support native file input with list of selected files; respects accept & multiple
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const files = e.target.files ? Array.from(e.target.files) : [];
          field.onChange(multiple ? files : files[0] ?? null);
        };
        // For displaying selected files
        const files = field.value
          ? Array.isArray(field.value)
            ? (field.value as File[])
            : field.value
            ? [field.value as File]
            : []
          : [];

        return (
          <Box>
            <Button variant="outlined" component="label" disabled={disabled} className={inputClassName}>
              {placeholder || "Choose file(s)"}
              <input
                id={name}
                hidden
                type="file"
                onChange={handleChange}
                multiple={multiple}
                accept={accept}
              />
            </Button>
            {files.length > 0 && (
              <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                {files.map((f, i) => (
                  <Chip key={`${f.name}-${i}`} label={f.name} />
                ))}
              </Box>
            )}
            {error && (
              <FormHelperText error sx={{ mt: 0.5 }}>
                {error}
              </FormHelperText>
            )}
          </Box>
        );
      }

      case "number":
        return (
          <TextField
            {...field}
            {...commonTextFieldProps}
            type="number"
            onChange={(e) => {
              const v = e.target.value;
              // keep empty string as is; otherwise cast to number
              field.onChange(v === "" ? "" : Number(v));
            }}
          />
        );

      case "multi-input":
        return (
          <MultiInputField
            name={name}
            control={control}
            placeholder={placeholder}
            inputClassName={inputClassName}
          />
        );

      // text | email | password (default)
      default:
        return (
          <TextField
            {...field}
            {...commonTextFieldProps}
            type={type}
            value={value !== undefined ? value : field.value ?? ""}
          />
        );
    }
  };

  return (
    <Controller 
      control={control}
      name={name}
      defaultValue={initialValue as any}
      render={({ field, fieldState }) => (
        <Box className={className}>
          {renderHeaderLabel()}
          {renderFormControl(
            {
              ...field,
              // Ensure external 'value' can override if provided
              value: value !== undefined ? value : field.value,
            },
            fieldState.error?.message
          )}
        </Box>
      )}
    />
  );
};

interface MultiInputFieldProps {
  name: string;
  control: any;
  placeholder?: string;
  inputClassName?: string;
}

const MultiInputField: React.FC<MultiInputFieldProps> = ({
  name,
  control,
  placeholder,
  inputClassName,
}) => {
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      {fields.map((f, index) => (
        <Box key={f.id} display="flex" alignItems="center" gap={1}>
          <Controller
            control={control}
            name={`${name}.${index}`}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder={placeholder}
                className={inputClassName}
              />
            )}
          />
          <IconButton aria-label="remove" onClick={() => remove(index)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <Box>
        <Button
          type="button"
          onClick={() => append("")}
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
        >
          Add Item
        </Button>
      </Box>
    </Box>
  );
};
