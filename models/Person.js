import dayjs from 'dayjs';

export default class Person {
    constructor(fname, lname, email, sex, mobile_no, birthdate, address) {
        this.fname = fname;
        this.lname = lname;
        this.email = email;
        this.setMobileNo(mobile_no);
        this.address = address;
        this.setBirthDate(birthdate);
        this.setSex(sex);
    }
    setMobileNo(number) {
        this.mobile_no = number.replace('-', '');
    }
    setBirthDate(date) {
        date = dayjs(date);
        this.birthdate = `${date.date()} ${date.format('MMM')} ${date.year()}`;
    }
    setSex(sex) {
        switch (sex?.toUpperCase?.()) {
            case 'M':
                this.sex = 'Male';
                break;
            case 'F':
                this.sex = 'Female';
                break;
            case 'O':
                this.sex = 'Other';
                break;
            default:
                this.sex = (sex == null || sex == '') ? '' : '';
        }
    }
}