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
  rows = 3,
  required = false,
  endIcon,
  maxLength = 255,
  max,
  min,
  readOnly,
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
          sx={{
            mb: "4px",
            "& .MuiFormLabel-asterisk": {
              color: "red",
            },
          }}
          htmlFor={name}
          error={!!error}
        >
          {label}
        </InputLabel>
      )}
      <TextField
        {...register(name, {
          required: required && "This field is required",
        })}
        size={size}
        placeholder={placeholder}
        fullWidth
        defaultValue={defaultValue}
        disabled={disabled}
        error={!!error}
        type={"text"}
        value={value}
        inputProps={{
          maxLength: maxLength || null,
          max: max,
          min: min,
        }}
        InputProps={{ ...InputProps, sx: { borderRadius: "10px" } }}
        {...props}
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
