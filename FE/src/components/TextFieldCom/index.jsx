import {
  Box,
  FormHelperText,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";

const TextFieldCom = ({
  rhf,
  value,
  helperText,
  error,
  disabled = false,
  name,
  defaultValue,
  size = "small",
  placeholder,
  label,
  isTextArea = false,
  rows = 3,
  required = false,
  endIcon,
  maxLength = 255,
  max,
  min,
  readOnly,
  validation,
  ...props
}) => {
  const { register } = rhf;

  const InputProps = endIcon
    ? {
        InputProps: {
          endAdornment: endIcon ? (
            <InputAdornment position="end">{endIcon}</InputAdornment>
          ) : (
            <></>
          ),
        },
      }
    : readOnly
    ? {
        InputProps: {
          readOnly,
        },
      }
    : {};

  return (
    <Box>
      {label && (
        <InputLabel
          required={!!required}
          sx={{ mb: "4px" }}
          htmlFor={name}
          error={!!error}
        >
          {label}
        </InputLabel>
      )}
      <TextField
        {...register(name, {
          required: required && "Kolom ini wajib diisi",
          validate: {
            ...validation,
          },
        })}
        size={size}
        placeholder={placeholder}
        fullWidth
        defaultValue={defaultValue}
        disabled={disabled}
        error={!!error}
        multiline={isTextArea}
        rows={isTextArea ? rows : 1}
        type={isNumber ? "number" : "text"}
        value={value}
        inputProps={{
          maxLength: maxLength || null,
          max: max,
          min: min,
        }}
        {...props}
        {...InputProps}
      />
      {helperText && (
        <FormHelperText error={error} htmlFor={name}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default TextFieldCom;
