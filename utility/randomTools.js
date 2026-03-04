import fs from 'fs';
import path from 'path';
import readCSV from '../utility/readCSV';
import Person from '../models/Person';
import locateState from '../datasets/location_state.json';
import subjectList from '../datasets/keyword_subject.json';

export function randomPerson() {
    const rawData = readCSV('happy_file.csv');
    let no = Math.floor(Math.random() * (rawData.length));
    const data = rawData[no];
    return new Person(data.fname, data.lname, data.email, data.sex, data.mobile_no, data.birthdate, data.address);
}

export function randomOptionsAddress() {
    let noState = Math.floor(Math.random() * Object.keys(locateState.state).length);
    let noCity = Math.floor(Math.random() * locateState.state[noState].city.length);
    return { states: locateState.state[(noState).toString()].name, city: locateState.state[(noState).toString()].city[noCity] };
}

export function randomHobbies() {
    return {
        sports: Math.floor(Math.random() * 2),
        reading: Math.floor(Math.random() * 2),
        music: Math.floor(Math.random() * 2),
    };
}

export function randomSubjects(amount) {
    let subjects = [];
    let maxSubjects = amount ? amount : Math.floor(Math.random() * 3);
    for (let i=1; i<=maxSubjects; i++) {
        let randomIdx = Math.floor(Math.random() * subjectList.length);
        subjects.push(subjectList[randomIdx]);
    }

    return subjects.sort();
}

export function randomImage() {
    const imageDir = path.join(process.cwd(), 'datasets');
    const files = fs.readdirSync(imageDir).filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    const randomIdx = Math.floor(Math.random() * files.length);
    return files[randomIdx];
}