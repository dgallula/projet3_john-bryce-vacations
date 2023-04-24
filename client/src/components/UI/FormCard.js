import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect, useState } from "react";

import classes from "./FormCard.module.css";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { checkEmail } from "../../common/userActions";
import { useSelector } from "react-redux";
import {
  loginValidationSchema,
  profileValidationSchema,
  registerValidationSchema,
} from "../../common/Validation";
import { Formik, Form, Field } from "formik";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";

const FormCard = (props) => {
  const title = props.title;
  const userInfo = useSelector((state) => state.user.userInfo);

  const [isLogin, setIsLogin] = useState(true);
  const [isExists, setIsExists] = useState({});
  const [cardTitle, setCardTitle] = useState("");
  const [schema, setSchema] = useState({});
  const [buttonText, setButtonText] = useState("");
  const [values, setValues] = useState({
    firstName: userInfo.firstName || "",
    lastName: userInfo.lastName || "",
    email: userInfo.email || "",
    password: "",
    showPassword: false,
  });

  useEffect(() => {
    console.log("-------- use effect for the title and button text -------");
    if (title === "Profile") {
      setIsLogin(false);
      setCardTitle("Your Profile");
      setButtonText("Edit profile");
    } else if (isLogin) {
      setCardTitle("Login");
      setButtonText("Login");
    } else {
      setCardTitle("Create Account");
      setButtonText("Register");
    }
    if (isLogin) {
      setIsExists({ flag: false });
    }
  }, [isLogin, title]);

  useEffect(() => {
    console.log("-------- use effect for the schma -------");
    if (title === "Profile") {
      setSchema(profileValidationSchema);
    }
    if (isLogin) {
      setSchema(loginValidationSchema);
    } else if (title !== "Profile" && !isLogin) {
      setSchema(registerValidationSchema);
    }
  }, [isLogin, title, schema]);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const handleChange = (prop) => (event) => {
    let value = event.target.value;
    if (prop === "email" || prop === "password") {
      value = event.target.value.trim();
    }
    setValues({ ...values, [prop]: value });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const checkEmailHandler = async (e) => {
    const emailToCheck = e.target.value;
    if (emailToCheck && !isLogin && title !== "Profile") {
      const userData = await checkEmail(emailToCheck);
      userData.length !== 0
        ? setIsExists({ flag: true, message: "This email is alredy exists" })
        : setIsExists({ flag: false });
    }
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (title === "Profile" && !isLogin) {
      props.updateProfile(
        {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email.toLowerCase(),
        },
        userInfo.id
      );
    }
    if (isLogin) {
      props.onLogIn(values.email, values.password);
    }
    if (!isLogin && title !== "Profile") {
      props.onRegister({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email.toLowerCase(),
        password: values.password,
      });
    }
  };

  return (
    <>
      <Container className={classes.formContainer} maxWidth='sm'>
        <Card className={classes.card} sx={{ justifyItems: "center" }}>
          <AccountCircle
            sx={{
              fontSize: 60,
              marginLeft: "auto",
              marginRight: "auto",
              color: "#3bc9db",
            }}
          />
          <CardHeader
            title={cardTitle}
            titleTypographyProps={{
              fontFamily: "Roboto",
              fontSize: "34px",
              fontWeight: "500",
              color: "transparent",
            }}
            sx={{
              backgroundImage: `linear-gradient(90deg, rgba(145, 211, 219, 1) 0%, rgba(80, 203, 196, 1) 50%, rgba(105, 196, 169, 1) 100%)`,
              backgroundClip: "text",
            }}
          />
          <CardContent>
            <Formik
              initialValues={values}
              validationSchema={schema}
              onSubmit={(formValues) => {
                submitHandler();
              }}
            >
              {({ errors, isValid, touched, dirty }) => (
                <Form>
                  {(!isLogin || title === "Profile") && (
                    <>
                      <FormControl
                        sx={{ m: 1, width: "100%" }}
                        variant='outlined'
                        onChange={handleChange("firstName")}
                      >
                        <Field
                          name='firstName'
                          type='text'
                          as={TextField}
                          value={values.firstName}
                          variant='outlined'
                          color='primary'
                          label='First Name'
                          error={
                            Boolean(errors.firstName) &&
                            Boolean(touched.firstName)
                          }
                          helperText={
                            Boolean(touched.firstName) && errors.firstName
                          }
                        />
                      </FormControl>
                      <FormControl
                        sx={{ m: 1, width: "100%" }}
                        variant='outlined'
                        onChange={handleChange("lastName")}
                      >
                        <Field
                          name='lastName'
                          type='text'
                          as={TextField}
                          value={values.lastName}
                          variant='outlined'
                          color='primary'
                          label='Last Name'
                          error={
                            Boolean(errors.lastName) &&
                            Boolean(touched.lastName)
                          }
                          helperText={
                            Boolean(touched.lastName) && errors.lastName
                          }
                        />
                      </FormControl>
                    </>
                  )}

                  <FormControl
                    sx={{ m: 1, width: "100%" }}
                    variant='outlined'
                    onChange={handleChange("email")}
                    onBlur={checkEmailHandler}
                  >
                    <Field
                      name='email'
                      type='email'
                      as={TextField}
                      variant='outlined'
                      color='primary'
                      label='Email'
                      error={
                        (Boolean(errors.email) && Boolean(touched.email)) ||
                        isExists.flag
                      }
                      helperText={
                        (Boolean(touched.email) && errors.email) ||
                        (isExists.flag && !isLogin && isExists.message)
                      }
                    />
                  </FormControl>

                  {title !== "Profile" && (
                    <>
                      <FormControl
                        sx={{ m: 1, width: "100%" }}
                        variant='outlined'
                        onChange={handleChange("password")}
                      >
                        <Field
                          name='password'
                          type={values.showPassword ? "text" : "password"}
                          as={TextField}
                          variant='outlined'
                          color='primary'
                          label='Password'
                          error={
                            Boolean(errors.password) &&
                            Boolean(touched.password)
                          }
                          helperText={
                            Boolean(touched.password) && errors.password
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <IconButton
                                  aria-label='toggle password visibility'
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  edge='end'
                                >
                                  {values.showPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </FormControl>
                      <Button size='small' onClick={switchAuthModeHandler}>
                        {isLogin
                          ? "Create new account"
                          : "Login with existing account"}
                      </Button>
                    </>
                  )}

                  <CardActions sx={{ justifyContent: "center" }}>
                    <Button
                      type='submit'
                      variant='contained'
                      size='large'
                      sx={{
                        backgroundColor: "#22b8cf",
                        ":hover": { backgroundColor: "#66d9e8" },
                      }}
                      disabled={(!isValid || !dirty) && title !== "Profile"}
                      onClick={submitHandler}
                    >
                      {buttonText === "Register" && (
                        <PersonAddAltRoundedIcon sx={{ mr: 1.5 }} />
                      )}
                      {buttonText === "Login" && (
                        <LoginRoundedIcon sx={{ mr: 1.5 }} />
                      )}
                      {buttonText}
                    </Button>
                  </CardActions>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default FormCard;
