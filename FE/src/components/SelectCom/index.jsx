import { Clear, Refresh } from "@mui/icons-material";
import {
  Box,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

const SelectCom = ({
  label,
  RHF,
  error,
  helperText,
  name,
  placeholder,
  options,
  getOption = null,
  loading = false,
  required = false,
  disabled = false,
  multiple = false,
  ...props
}) => {
  const { control, watch } = RHF;
  const value = watch(name);
  const [open, setOpen] = useState(false);

  const placeholderProps = loading
    ? {
        renderValue: () => <span style={{ opacity: "0.4" }}>Loading ...</span>,
      }
    : options?.length > 0 &&
      value &&
      (value?.length > 0 || typeof value === "number")
    ? {}
    : {
        renderValue: () => (
          <span style={{ opacity: "0.4" }}>{placeholder}</span>
        ),
      };

  const handleClear = () => {
    RHF.setValue(name, multiple ? [] : "");
  };

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
          error={error}
        >
          {label}
        </InputLabel>
      )}
      <Controller
        name={name}
        control={control}
        defaultValue=""
        displayEmpty
        rules={{ required: required && "Kolom ini wajib diisi" }}
        render={({ field }) => (
          <>
            <Select
              open={open}
              multiple={!!multiple}
              disabled={disabled}
              error={error}
              displayEmpty
              sx={{ borderRadius: "10px" }}
              onChange={(e) => {
                field?.onChange(e.target.value);
              }}
              value={multiple ? field?.value || [] : field?.value?.toString()}
              {...props}
              {...placeholderProps}
              IconComponent={
                options?.length > 0 &&
                field.value &&
                !disabled &&
                (multiple ? field.value.length > 0 : field.value !== "")
                  ? () => (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClear();
                        }}
                        sx={{ marginRight: 1.2, padding: 0 }}
                      >
                        <Clear sx={{ fontSize: 18 }} />
                      </IconButton>
                    )
                  : undefined
              }
              onOpen={() => {
                if (options?.length === 0 && Boolean(getOption)) {
                  getOption();
                } else {
                  setOpen(true);
                }
              }}
              onClose={() => {
                setOpen(false);
              }}
            >
              <MenuItem value="" disabled>
                {loading ? "Loading..." : placeholder || "Select"}
              </MenuItem>
              {options?.map((val, i) => {
                return (
                  <MenuItem
                    key={`optionDrop-${i}`}
                    value={val?.value?.toString()}
                  >
                    {val.label}
                  </MenuItem>
                );
              })}
            </Select>
            {helperText && (
              <FormHelperText error={error} htmlFor={name}>
                {helperText}
              </FormHelperText>
            )}
          </>
        )}
      />
    </Box>
  );
};

export default SelectCom;
