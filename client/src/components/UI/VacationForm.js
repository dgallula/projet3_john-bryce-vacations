import {
  Button,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  Stack,
  TextField,
} from "@mui/material";
import PhotoSizeSelectActualOutlinedIcon from "@mui/icons-material/PhotoSizeSelectActualOutlined";

import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Field, Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import VacationsFunctions from "../../common/VacationsFunctions";
import {
  dateDifference,
  vacationValidationSchema,
} from "../../common/Validation";
import { useNavigate } from "react-router-dom";

const VacationForm = (props) => {
  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [values, setValues] = useState({
    destination: (props.vacation && props.vacation.destination) || "",
    description: (props.vacation && props.vacation.description) || "",
    price: (props.vacation && props.vacation.price) || "",
    startDate: (props.vacation && props.vacation.startDate) || null,
    endDate: (props.vacation && props.vacation.endDate) || null,
    image: (props.vacation && props.vacation.image) || "",
  });
  const [datesAndImageErrors, setDatesAndImageErrors] = useState({
    startDateError: false,
    endDateError: false,
    imageError: false,
    errorMessage: "",
  });

  useEffect(() => {
    if (props.vacation) {
      setIsEditMode(true);
    }
  }, []);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleStartDateChange = (newValue) => {
    checkDate(newValue, "startDateError");
    try {
      setValues({ ...values, startDate: new Date(newValue).toISOString() });
    } catch (error) {
      console.log(error);
    }
  };

  const handleEndDateChange = (newValue) => {
    checkDate(newValue, "endDateError");
    try {
      if (values.startDate !== null) {
        const isDifferenceValid = dateDifference(values.startDate, newValue);
        if (!isDifferenceValid) {
          setDatesAndImageErrors({
            ...datesAndImageErrors,
            endDateError: true,
            errorMessage:
              "The end date of the vacation must be after the start date of the vacation",
          });
        } else {
          setValues({ ...values, endDate: new Date(newValue).toISOString() });
        }
      }
      setValues({ ...values, endDate: new Date(newValue).toISOString() });
    } catch (error) {
      console.log(error);
    }
  };

  const submitHandler = () => {
    const isDifferenceValid = dateDifference(values.startDate, values.endDate);
    if (!isDifferenceValid || (!isDifferenceValid && isEditMode)) {
      setDatesAndImageErrors({
        ...datesAndImageErrors,
        endDateError: true,
        errorMessage:
          "The end date of the vacation must be after the start date of the vacation",
      });
    }
    if (values.startDate === null) {
      setDatesAndImageErrors({
        ...datesAndImageErrors,
        startDateError: true,
        errorMessage: "Start date is required",
      });
    } else if (values.endDate === null) {
      setDatesAndImageErrors({
        ...datesAndImageErrors,
        endDateError: true,
        errorMessage: "End date is required",
      });
    } else if (values.image === "" && !isEditMode) {
      setDatesAndImageErrors({
        ...datesAndImageErrors,
        imageError: true,
        errorMessage: "Image is required",
      });
    } else {
      if (isEditMode) {
        const setValuesForServer = { ...values, id: props.vacation.id };
        props.onUpdate(setValuesForServer);
        props.onClose();
      } else {
        props.onAdd(values);
      }
    }
  };

  const checkDate = (date, startOrEnd) => {
    const givenDate = new Date(date);
    const today = new Date();
    const isToday = today.toDateString() === givenDate.toDateString();
    if (isToday || date === null) {
      setDatesAndImageErrors({
        ...datesAndImageErrors,
        [startOrEnd]: true,
        errorMessage: startOrEnd.includes("start")
          ? "The start date of the vacation can not be today"
          : "The end date of the vacation can not be today",
      });
    } else {
      setDatesAndImageErrors({
        ...datesAndImageErrors,
        [startOrEnd]: false,
        errorMessage: "",
      });
    }
  };

  const cancelHandler = () => {
    if (isEditMode) {
      props.onClose();
    } else {
      navigate("/vacations");
    }
  };

  const hiddenFileInput = useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleFileChange = (event) => {
    try {
      const fileUploaded = {
        preview: URL.createObjectURL(event.target.files[0]),
        data: event.target.files[0],
      };

      setValues({ ...values, image: fileUploaded.data.name });
      setDatesAndImageErrors({
        ...datesAndImageErrors,
        imageError: false,
        errorMessage: "",
      });
      sendImage(fileUploaded);
    } catch (error) {
      setDatesAndImageErrors({
        ...datesAndImageErrors,
        imageError: true,
        errorMessage: "Image is required",
      });
    }
  };

  const sendImage = (image) => {
    let formData = new FormData();
    formData.append("file", image.data);
    VacationsFunctions.sendImage(formData);
  };

  return (
    <Container
      maxWidth='md'
      sx={{
        m: "auto",
        width: !isEditMode ? "100%" : "90%",
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <h1 style={{ textAlign: "center" }}>
        {!isEditMode ? "Add New Vacation" : "Edit Vacation"}
      </h1>

      <Formik
        initialValues={values}
        validationSchema={vacationValidationSchema}
        onSubmit={(formikHelpers) => {
          submitHandler();
          formikHelpers.resetForm();
        }}
      >
        {({ errors, isValid, touched, dirty }) => (
          <Form>
            <FormControl
              sx={{ mb: 2, width: "100%" }}
              variant='outlined'
              onChange={handleChange("destination")}
            >
              <Field
                name='destination'
                type='text'
                as={TextField}
                value={values.destination}
                variant='outlined'
                color='primary'
                label='Destination'
                error={
                  Boolean(errors.destination) && Boolean(touched.destination)
                }
                helperText={Boolean(touched.destination) && errors.destination}
              />
            </FormControl>
            <FormControl
              sx={{ mb: 2, width: "100%" }}
              variant='outlined'
              onChange={handleChange("description")}
            >
              <Field
                name='description'
                type='text'
                as={TextField}
                value={values.description}
                variant='outlined'
                color='primary'
                label='description'
                error={
                  Boolean(errors.description) && Boolean(touched.description)
                }
                helperText={Boolean(touched.description) && errors.description}
              />
            </FormControl>
            <FormControl
              sx={{ mb: 2, width: "100%" }}
              variant='outlined'
              onChange={handleChange("price")}
            >
              <Field
                name='price'
                type='number'
                as={TextField}
                value={values.price}
                variant='outlined'
                color='primary'
                label='Price'
                error={Boolean(errors.price) && Boolean(touched.price)}
                helperText={Boolean(touched.price) && errors.price}
              />
            </FormControl>

            <FormControl sx={{ mb: 2, width: "100%" }} variant='outlined'>
              <InputLabel htmlFor='outlined-adornment-image'>Image</InputLabel>
              <>
                <IconButton
                  onClick={handleClick}
                  sx={{ ":hover": { background: "none" } }}
                >
                  <PhotoSizeSelectActualOutlinedIcon />
                  Upload an image
                </IconButton>

                <input
                  type='file'
                  ref={hiddenFileInput}
                  style={{ display: "none" }}
                  accept='image/*'
                  onChange={handleFileChange}
                />
                {datesAndImageErrors.imageError && (
                  <FormHelperText
                    sx={{ color: "red", fontSize: "14px", fontWeight: 600 }}
                  >
                    {datesAndImageErrors.errorMessage}
                  </FormHelperText>
                )}
              </>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <Stack spacing={3} sx={{ mb: 2, width: "100%" }}>
                <DesktopDatePicker
                  label='Start Date'
                  inputFormat='DD/MM/yyyy'
                  value={values.startDate}
                  disablePast
                  onChange={handleStartDateChange}
                  renderInput={(params) => <TextField {...params} disabled />}
                  error={datesAndImageErrors.startDateError}
                />
                {datesAndImageErrors.startDateError && (
                  <FormHelperText
                    sx={{ color: "red", fontSize: "14px", fontWeight: 600 }}
                  >
                    {datesAndImageErrors.errorMessage}
                  </FormHelperText>
                )}

                <DesktopDatePicker
                  label='End Date'
                  inputFormat='DD/MM/yyyy'
                  value={values.endDate}
                  disablePast
                  onChange={handleEndDateChange}
                  renderInput={(params) => <TextField {...params} disabled />}
                />
                {datesAndImageErrors.endDateError && (
                  <FormHelperText
                    sx={{ color: "red", fontSize: "14px", fontWeight: 600 }}
                  >
                    {datesAndImageErrors.errorMessage}
                  </FormHelperText>
                )}
              </Stack>
            </LocalizationProvider>
            <Stack
              direction='row'
              divider={<Divider orientation='vertical' flexItem />}
              spacing={2}
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: isEditMode ? "15px" : "none",
              }}
            >
              <Button
                type='submit'
                onClick={submitHandler}
                variant='contained'
                sx={{
                  backgroundColor: "#22b8cf",
                  ":hover": { backgroundColor: "#66d9e8" },
                }}
                size='large'
                disabled={
                  (!isValid ||
                    !dirty ||
                    datesAndImageErrors.startDateError ||
                    datesAndImageErrors.endDateError ||
                    datesAndImageErrors.imageError) &&
                  !isEditMode
                }
              >
                {!isEditMode ? "Add Vacation" : "Edit vacation"}
              </Button>
              <Button type='button' onClick={cancelHandler} size='large'>
                Cancel
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default VacationForm;
