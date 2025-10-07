import { AppointmentType, ConsultancyType, DoctorTitle, Gender, MaritalStatus } from 'src/app/proxy/enums';
import { CommonService } from '../services/common.service';
const consultancyType = CommonService.getEnumList(ConsultancyType);

const genderList = CommonService.getEnumList(Gender);
const maritalOptions = CommonService.getEnumList(MaritalStatus);
const titleList = CommonService.getEnumList(DoctorTitle);
const appointmentType = CommonService.getEnumList(AppointmentType);

export const inputConfigs = [
  {
    label: 'Your Title',
    inputId: 'doctorTitle',
    defaultOption: 'Select Title',
    options: titleList,
    formControlName: 'doctorTitle',
    isSelect: true,
    type: 'select',
  },
  {
    label: 'Full Name',
    inputId: 'fullName',
    formControlName: 'fullName',
    isSelect: false,
    type: 'text',
  },
  {
    label: 'Email',
    inputId: 'email',
    formControlName: 'email',
    isSelect: false,
    readonly: true,
    type: 'email',
  },
  {
    label: 'Gender',
    inputId: 'gender',
    formControlName: 'gender',
    options: genderList,
    isSelect: true,
    type: 'select',
  },
  {
    label: 'Martial Status',
    inputId: 'maritalStatus',
    formControlName: 'maritalStatus',
    options: maritalOptions,
    isSelect: true,
    type: 'select',
  },
  {
    label: 'Date of Birth',
    inputId: 'dateOfBirth',
    formControlName: 'dateOfBirth',
    isSelect: false,
    type: 'date',
  },
  {
    label: 'Identity Number',
    inputId: 'identityNumber',
    formControlName: 'identityNumber',
    isSelect: false,
    type: 'number',
  },
  {
    label: 'BMDC Reg Number',
    inputId: 'bmdcRegNo',
    formControlName: 'bmdcRegNo',
    isSelect: false,
    type: 'number',
  },
  {
    label: 'BMDC Exp. Date',
    inputId: 'bmdcRegExpiryDate',
    formControlName: 'bmdcRegExpiryDate',
    isSelect: false,
    type: 'date',
  },
  {
    label: 'Address',
    inputId: 'address',
    formControlName: 'address',
    isSelect: false,
    type: 'text',
  },
  {
    label: 'Country',
    inputId: 'country',
    formControlName: 'country',
    isSelect: false,
  },
  {
    label: 'City',
    inputId: 'city',
    formControlName: 'city',
    isSelect: false,
    type: 'text',
  },
  {
    label: 'Zip Code',
    inputId: 'zipCode',
    formControlName: 'zipCode',
    isSelect: false,
    type: 'number',
  },
  {
    label: 'Specialties',
    inputId: 'specialityId',
    formControlName: 'specialityId',
    //   options: this.specialties,
    isSelect: false,
    type: 'select',
  },
  // ... add more input configurations for other fields
];


export const patientInputData = [

  {
    label: 'Full Name',
    inputId: 'fullName',
    formControlName: 'fullName',
    isSelect: false,
    type: 'text',
  },
  {
    label: 'Email',
    inputId: 'email',
    formControlName: 'email',
    isSelect: false,
    readonly: true,
    type: 'email',
  },
  {
    label: 'Date of Birth',
    inputId: 'dateOfBirth',
    formControlName: 'dateOfBirth',
    isSelect: false,
    type: 'date',
  },
  {
    label: 'Address',
    inputId: 'address',
    formControlName: 'address',
    isSelect: false,
    type: 'text',
  },
  {
    label: 'Country',
    inputId: 'country',
    formControlName: 'country',
    isSelect: false,
  },
  {
    label: 'City',
    inputId: 'city',
    formControlName: 'city',
    isSelect: false,
    type: 'text',
  },
  {
    label: 'Zip Code',
    inputId: 'zipCode',
    formControlName: 'zipCode',
    isSelect: false,
    type: 'number',
  },

  // ... add more input configurations for other fields
];


export const scheduleData = (consType: any, apType: any, hospital: any) => {
  return [
    {
      label: 'Select Consultancy Type',
      inputId: 'consultancyType',
      defaultOption: 'Select Consultancy Type',
      options: hospital,
      formControlName: 'consultancyType',
      isSelect: true
    },
    {
      label: 'Select Hospital',
      inputId: 'doctorChamberId',
      defaultOption: 'Select Hospital ',
      options: consType,
      formControlName: 'doctorChamberId',
      isSelect: true
    },
    {
      label: 'Select appointment type',
      inputId: 'scheduleType',
      defaultOption: 'Select appointment type',
      options: apType,
      formControlName: 'scheduleType',
      isSelect: true
    }
    
  ];
};

export const feesInputData =  (aptype: any, dsList: any) => {
  return [
    {
      label: 'Appointment Type',
      inputId: 'appointmentType',
      placeholder: 'Appointment Type',
      formControlName: 'appointmentType',
      isSelect: true,
      required: true,
      options: aptype,
    },
    {
      label: 'Doctor Schedule',
      inputId: 'doctorScheduleId',
      placeholder: 'Doctor Schedule',
      formControlName: 'doctorScheduleId',
      isSelect: true,
      required: true,
      options: dsList,
    },
    {
      label: 'Current Fee',
      inputId: 'currentFee',
      placeholder: 'Current Fee',
      formControlName: 'currentFee',
      type: 'number',
      required: true,
    },
    {
      label: 'Previous Fee',
      inputId: 'previousFee',
      placeholder: 'Previous Fee',
      formControlName: 'previousFee',
      type: 'number',
    },



    {
      label: 'Fee Applied From',
      inputId: 'feeAppliedFrom',
      placeholder: 'Fee Applied From',
      formControlName: 'feeAppliedFrom',
      isSelect: false,
      type: 'date',
    },
    {
      label: 'FollowUp Period',
      inputId: 'followUpPeriod',
      placeholder: 'FollowUp Period',
      formControlName: 'followUpPeriod',
      type: 'number',
    },
    {
      label: 'Report Show Period',
      inputId: 'reportShowPeriod',
      placeholder: 'Report Show Period',
      formControlName: 'reportShowPeriod',
      type: 'number',
    },
    {
      label: 'Discount',
      inputId: 'discount',
      placeholder: 'Discount',
      formControlName: 'discount',
      type: 'number',
    },
    {
      label: 'Discount Applied From',
      inputId: 'discountAppliedFrom',
      placeholder: 'Discount Applied From',
      formControlName: 'discountAppliedFrom',
      type: 'date',
    },
    {
      label: 'Discount Period',
      inputId: 'discountPeriod',
      placeholder: 'Discount Period',
      formControlName: 'discountPeriod',
      type: 'number',
    },
    {
      label: 'Total Fee',
      inputId: 'totalFee',
      placeholder: 'Total Fee',
      formControlName: 'totalFee',
      type: 'number',
    },
  ];
};

// export const agentBookingInpuData = [
//   {
//     label: 'Your Title',
//     inputId: 'doctorTitle',
//     defaultOption: 'Select Title',
//     options: titleList,
//     formControlName: 'doctorTitle',
//     isSelect: true,
//     type: 'select',
//   },
//   {
//     label: 'Full Name',
//     inputId: 'fullName',
//     formControlName: 'fullName',
//     isSelect: false,
//     type: 'text',
//   },
//   {
//     label: 'Email',
//     inputId: 'email',
//     formControlName: 'email',
//     isSelect: false,
//     readonly: true,
//     type: 'email',
//   },
// ]

export const agentInputData =[
  {
        label: 'Agent Name',
        inputId: 'fullName',
        formControlName: 'fullName',
        isSelect: false,
        type: 'text',
      },
      {
        label: 'Agent Id',
        inputId: 'agentCode',
        formControlName: 'agentCode',
        isSelect: false,
        type: 'text',
      },
      {
        label: 'Email',
        inputId: 'email',
        formControlName: 'email',
        isSelect: false,
        readonly: false,
        type: 'email',
      },
      {
        label: 'Address',
        inputId: 'address',
        formControlName: 'address',
        isSelect: false,
        type: 'text',
      },
]


export const bookingFilterInputData = (hospital: any) => {
  
  return [
    {
      label: 'Appointment Date',
      inputId: 'appointmentDate',
      defaultOption: 'Select Appointment Date',
      formControlName: 'appointmentDate',
      isSelect: false,
      type: 'date'
    },

    {
      label: 'Select Schedule Type',
      inputId: 'doctorScheduleType',
      defaultOption: 'Select Schedule Type ',
      options: hospital,
      formControlName: 'doctorScheduleType',
      isSelect: true,
    },
    // {
    //   label: 'Select Consultancy Type',
    //   inputId: 'consultancyType',
    //   defaultOption: 'Select Consultancy Type',
    //   options: consultancyType,
    //   formControlName: 'consultancyType',
    //   isSelect: true,
    // },
    {
      label: 'Select Appointment Type',
      inputId: 'appointmentType',
      defaultOption: 'Select Appointment Type',
      options: appointmentType,
      formControlName: 'appointmentType',
      isSelect: true,
    }
    
  ];
};




export const inputForCreatePatient = [
  {
    label: 'Patient Name',
    inputId: 'patientName',
    defaultOption: 'Write patient name',
    formControlName: 'patientName',
    isSelect: false,
    type: 'text',
  },
  {
    label: 'Age',
    inputId: 'age',
    formControlName: 'age',
    isSelect: false,
    type: 'text',
  },
  {
    label: 'Patient Mobile No',
    inputId: 'patientMobileNo',
    formControlName: 'patientMobileNo',
    isSelect: false,
    type: 'tel',
  },
  {
    label: 'Gender',
    inputId: 'gender',
    formControlName: 'gender',
    options: genderList,
    isSelect: true,
    type: 'select',
  },
  {
    label: 'Blood Group',
    inputId: 'bloodGroup',
    formControlName: 'bloodGroup',
    isSelect: false,
    type: 'text',
  }
  // ... add more input configurations for other fields
];

export const dayFromDate=(date:string)=>{
  const getdate = new Date(date);
  const dayOfWeek = getdate.getDay();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
return dayNames[dayOfWeek];
}
