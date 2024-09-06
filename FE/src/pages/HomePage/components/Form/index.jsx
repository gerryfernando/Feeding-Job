import { Grid } from "@mui/material";
import TextFieldCom from "../../../../components/TextFieldCom";
import SelectCom from "../../../../components/SelectCom";

import { useEffect } from "react";
import OptionsJobTag from "../../../../const/Options";

const FormJob = (props) => {
  const { RHF, isViewOnly = false, formType, row } = props;
  const {
    formState: { errors },
  } = RHF;

  return (
    <form data-testid="formJob" id={`${formType}-Form`}>
      <Grid spacing={2} container>
        <Grid item xs={12} md={6}>
          <TextFieldCom
            disabled={isViewOnly}
            rhf={RHF}
            id="jobName"
            name="jobName"
            label="Job Name"
            helperText={errors?.jobName ? errors?.jobName?.message : ""}
            error={!!errors?.jobName}
            placeholder="Job Name"
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextFieldCom
            disabled={isViewOnly}
            rhf={RHF}
            id="company"
            name="company"
            label="Company"
            helperText={errors?.company ? errors?.company?.message : ""}
            error={!!errors?.company}
            placeholder="Company"
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextFieldCom
            disabled={isViewOnly}
            rhf={RHF}
            id="location"
            name="location"
            label="Location"
            helperText={errors?.location ? errors?.location?.message : ""}
            error={!!errors?.location}
            placeholder="Location"
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextFieldCom
            disabled={isViewOnly}
            rhf={RHF}
            id="salary"
            name="salary"
            label="Salary"
            helperText={errors?.salary ? errors?.salary?.message : ""}
            error={!!errors?.salary}
            placeholder="Salary"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextFieldCom
            disabled={isViewOnly}
            rhf={RHF}
            id="workType"
            name="workType"
            label="Work Type"
            helperText={errors?.workType ? errors?.workType?.message : ""}
            error={!!errors?.workType}
            placeholder="Work Type"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SelectCom
            RHF={RHF}
            label="Job Tag"
            name="jobTag"
            required
            size="small"
            fullWidth
            options={OptionsJobTag}
            placeholder="Pilih"
            helperText={errors.jobTag ? errors.jobTag.message : ""}
            error={!!errors?.jobTag}
            disabled={isViewOnly}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextFieldCom
            disabled={isViewOnly}
            rhf={RHF}
            id="benefit"
            name="benefit"
            label="Benefit"
            helperText={errors?.benefit ? errors?.benefit?.message : ""}
            error={!!errors?.benefit}
            placeholder="Benefit"
            multiline
            rows={4}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextFieldCom
            disabled={isViewOnly}
            rhf={RHF}
            id="description"
            name="description"
            label="Description"
            helperText={errors?.description ? errors?.description?.message : ""}
            error={!!errors?.description}
            placeholder="Description"
            multiline
            rows={4}
          />
        </Grid>
        {/* <Grid item xs={12} md={6}>
        <JdAutoComplete
          rhf={RHF}
          id="roleId"
          label="Role"
          name="roleId"
          size="small"
          fullWidth
          placeholder="Pilih Role"
          loading={loadingRoleOptions}
          options={roleOptions}
          required
          helperText={
            errors.roleId ? errors.roleId.message : handleHelperText("roleId")
          }
          error={!!errors?.roleId}
          multiple
        />
      </Grid> */}
      </Grid>
    </form>
  );
};

export default FormJob;
