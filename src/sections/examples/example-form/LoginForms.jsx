// material-ui
import { Grid, Stack, Chip, Radio, Button, Switch, Divider, MenuItem, TextField, InputLabel, Typography, RadioGroup, FormControl, Autocomplete, ListItemText, OutlinedInput, FormHelperText, FormControlLabel, Select } from '@mui/material';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

// project-imports
import AnimateButton from 'components/@extended/AnimateButton';
import { openSnackbar } from 'api/snackbar';
import { CloseCircle } from 'iconsax-react';


// ==============================|| FORM VALIDATION - LOGIN FORMIK  ||============================== //

const skills = [
  'Adobe XD',
  'After Effect',
  'Angular',
  'Animation',
  'ASP.Net',
  'Bootstrap',
  'C#',
  'CC',
  'Corel Draw',
  'CSS',
  'DIV',
  'Dreamweaver',
  'Figma',
  'Graphics',
  'HTML',
  'Illustrator',
  'J2Ee',
  'Java',
  'Javascript',
  'JQuery',
  'Logo Design',
  'Material UI',
  'Motion',
  'MVC',
  'MySQL',
  'NodeJS',
  'npm',
  'Photoshop',
  'PHP',
  'React',
  'Redux',
  'Reduxjs & tooltit',
  'SASS',
  'SCSS',
  'SQL Server',
  'SVG',
  'UI/UX',
  'User Interface Designing',
  'Wordpress'
];

// CONSTANT
const getInitialValues = (customer) => {
  const newCustomer = {
    firstName: '',
    lastName: '',
    name: '',
    email: '',
    age: 18,
    avatar: 1,
    role: '',
    fatherName: '',
    orders: 0,
    progress: 50,
    status: 2,
    orderStatus: '',
    contact: '',
    country: '',
    location: '',
    about: '',
    skills: [],
    time: ['just now'],
    date: ''
  };

  if (customer) {
    return _.merge({}, newCustomer, customer);
  }

  return newCustomer;
};

const allStatus = [
  { value: 3, label: 'Rejected' },
  { value: 1, label: 'Verified' },
  { value: 2, label: 'Pending' }
];

// const CustomerSchema = Yup.object().shape({
//   firstName: Yup.string().max(255).required('First Name is required'),
//   lastName: Yup.string().max(255).required('Last Name is required'),
//   email: Yup.string().max(255).required('Email is required').email('Must be a valid email'),
//   status: Yup.string().required('Status is required'),
//   location: Yup.string().max(500),
//   about: Yup.string().max(500)
// });

export default function LoginForms() {


  const CustomerSchema = yup.object().shape({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string().min(8, 'Password should be of minimum 8 characters length').required('Password is required'),
    firstName: yup.string().max(255).required('First Name is required'),
    lastName: yup.string().max(255).required('Last Name is required'),
    status: yup.string().required('Status is required'),
    location: yup.string().max(500),
    about: yup.string().max(500)
  });
  
  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: CustomerSchema,
    onSubmit: () => {
      openSnackbar({
        open: true,
        message: 'Submit Success',
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
    }
  });

  const { errors, touched, setFieldValue } = formik;


  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="email">Email Address</InputLabel>
            <TextField
              fullWidth
              id="email"
              name="email"
              placeholder="Enter email address"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="email">Password</InputLabel>
            <TextField
              fullWidth
              id="password"
              name="password"
              placeholder="Enter your password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="customer-status">Status</InputLabel>
            <FormControl fullWidth>
              <Select
                id="column-hiding"
                displayEmpty
                onChange={(event) => setFieldValue('status', event.target.value)}
                input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
                renderValue={(selected) => {
                  if (!selected) {
                    return <Typography variant="subtitle1">Select Status</Typography>;
                  }

                  const selectedStatus = allStatus.filter((item) => item.value === Number(selected));
                  return (
                    <Typography variant="subtitle2">
                      {selectedStatus.length > 0 ? selectedStatus[0].label : 'Pending'}
                    </Typography>
                  );
                }}
              >
                {allStatus.map((column) => (
                  <MenuItem key={column.value} value={column.value}>
                    <ListItemText primary={column.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {touched.status && errors.status && (
              <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
                {errors.status}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="customer-skills">Skills</InputLabel>
            <Autocomplete
              multiple
              fullWidth
              id="customer-skills"
              options={skills}
              getOptionLabel={(label) => label}
              onChange={(event, newValue) => {
                setFieldValue('skills', newValue);
              }}
              renderInput={(params) => <TextField {...params} name="skill" placeholder="Add Skills" />}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    variant="combined"
                    key={index}
                    label={option}
                    deleteIcon={<CloseCircle style={{ fontSize: '0.75rem' }} />}
                    sx={{ color: 'text.primary' }}
                  />
                ))
              }
            />
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Stack spacing={0.5}>
              <Typography variant="subtitle1">Make Contact Info Public</Typography>
              <Typography variant="caption" color="text.secondary">
                Means that anyone viewing your profile will be able to see your contacts details
              </Typography>
            </Stack>
            <FormControlLabel control={<Switch defaultChecked sx={{ mt: 0 }} />} label="" labelPlacement="start" />
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Stack spacing={0.5}>
              <Typography variant="subtitle1">Available to hire</Typography>
              <Typography variant="caption" color="text.secondary">
                Toggling this will let your teammates know that you are available for acquiring new projects
              </Typography>
            </Stack>
            <FormControlLabel control={<Switch sx={{ mt: 0 }} />} label="" labelPlacement="start" />
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="flex-end">
            <AnimateButton>
              <Button variant="contained" type="submit">
                Verify & Submit
              </Button>
            </AnimateButton>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
}
