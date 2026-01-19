import React from "react";
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  useFormContext,
  useFieldArray,
  Control,
  RegisterOptions,
} from "react-hook-form";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
  FormHelperText,
  Switch,
  FormControlLabel,
  Button,
  IconButton,
  Box,
  InputLabel,
} from "@mui/material";
import { Edit, Close, Add } from "@mui/icons-material";
import { registerPlugin } from "filepond";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

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
  disabled?: boolean;
  multiple?: boolean;
  isIcon?: boolean;
  initialValue?: string | number | boolean | string[];
  rules?: RegisterOptions;
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
  disabled = false,
  multiple = false,
  isIcon = false,
  initialValue,
  rules, // ✅ ADDED
}) => {
  const { control } = useFormContext();

  const renderFormControl = (
    field: ControllerRenderProps<FieldValues, string>,
    error?: string
  ) => {
    switch (type) {
      case "textarea":
        return (
          <TextField
            {...field}
            placeholder={placeholder}
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            error={!disabled && !!error}  // ✅ Only show error when NOT disabled
            helperText={!disabled && error ? error : ""}  // ✅ Only show helper text when NOT disabled
            className={inputClassName}
            disabled={disabled}
          />
        );

      case "select":
        return (
          <FormControl fullWidth error={!!error} className={inputClassName}>
            <InputLabel>{placeholder}</InputLabel>
            <Select
              {...field}
              value={field.value ?? initialValue ?? ""} // ✅ FIXED: Better null handling
              label={placeholder}
              disabled={disabled}
            >
              {options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {!disabled && error  && ( 
            <FormHelperText>{error}</FormHelperText>
            )}
          </FormControl>
        );

      case "switch":
        return (
          <FormControlLabel
            control={
              <Switch
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                onBlur={field.onBlur} // ✅ ADDED: Blur handler
                disabled={disabled}
              />
            }
            label={label}
            className={labelClassName}
          />
        );

      case "file":
        return (
          <Box className={inputClassName}>
            <FilePond
              files={field.value || []} 
              onupdatefiles={(fileItems) => {
                const files = fileItems.map((fileItem) => fileItem.file);
                field.onChange(files);
              }}
              onblur={field.onBlur} 
              allowMultiple={multiple}
              acceptedFileTypes={accept ? [accept] : undefined} 
              labelIdle={`Drag & Drop your ${multiple ? 'files' : 'file'} or <span class="filepond--label-action">Browse</span>`}
              credits={false}
            />
            {!disabled && error && (
              <FormHelperText error sx={{ ml: 2 }}>
                {error}
              </FormHelperText>
            )}
          </Box>
        );

      case "number":
        return (
          <TextField
            {...field}
            type="number"
            placeholder={placeholder}
            fullWidth
            variant="outlined"
            error={!disabled && !!error}  // ✅ Only show error when NOT disabled
            helperText={!disabled && error ? error : ""}  // ✅ Only show helper text when NOT disabled
             className={inputClassName}
            disabled={disabled}
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

      default:
        return (
          <TextField
            {...field}
            type={type}
            placeholder={placeholder}
            fullWidth
            variant="outlined"
            error={!!error}
            helperText={error}
            className={inputClassName}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={initialValue}
      rules={rules} // ✅ ADDED: Pass validation rules
      render={({ field, fieldState: { error } }) => (
        <Box className={className} sx={{ mb: 2 }}>
          {type !== "switch" && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <FormLabel className={labelClassName} sx={{ fontSize: "0.875rem" }}>
                {label}
              </FormLabel>

              {!disabled &&
                isIcon &&
                type !== "file" &&
                type !== "multi-input" && (
                  <Edit sx={{ fontSize: 16, color: "text.secondary" }} />
                )}
            </Box>
          )}

          {renderFormControl(field, error?.message)} {/* ✅ FIXED: Simplified */}
        </Box>
      )}
    />
  );
};

interface MultiInputFieldProps {
  name: string;
  control: Control<any>; 
  placeholder?: string;
  inputClassName?: string;
}

const MultiInputField: React.FC<MultiInputFieldProps> = ({
  name,
  control,
  placeholder,
  inputClassName,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {fields.map((field, index) => (
        <Box
          key={field.id}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Controller
            control={control}
            name={`${name}.${index}`}
            render={({ field, fieldState: { error } }) => ( // ✅ ADDED: error
              <TextField
                {...field}
                placeholder={placeholder}
                fullWidth
                variant="outlined"
                error={!!error} // ✅ ADDED: Show error state
                helperText={error?.message} // ✅ ADDED: Show error message
                className={inputClassName}
              />
            )}
          />
          <IconButton
            onClick={() => remove(index)}
            color="default"
            size="small"
            aria-label="Remove item" // ✅ ADDED: Accessibility
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <Button
        onClick={() => append("")}
        variant="outlined"
        size="small"
        startIcon={<Add />}
        sx={{ alignSelf: "flex-start", mt: 1 }}
      >
        Add Item
      </Button>
    </Box>
  );
};