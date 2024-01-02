// it will take array of objects 
Array.converter = function (originalData) {
    let data = [...originalData]
    // console.log("🚀 ~ file: custom-methods.js:3 ~ originalData:", originalData)
    // converted strings
    let convertedString = ['id', 'email', 'employee_id', 'name']
    data = data.map((admin_data) => {
        // extract email, employee_id, name
        let extracted_data = convertedString.map((key) => [key == 'email' ? 'value' : key, admin_data[key]])
        // console.log("🚀 ~ file: custom-methods.js:10 ~ data=data.forEach ~ extracted_data:", extracted_data)
        extracted_data = Object.fromEntries(extracted_data)
        // console.log("🚀 ~ file: custom-methods.js:12 ~ data=data.forEach ~ extracted_data:", extracted_data)

        extracted_data.label = `${extracted_data['employee_id']} - ${extracted_data['name']}`
        // delete employee_id and name
        // delete extracted_data.employee_id
        delete extracted_data.name
        // console.log("🚀 ~ file: custom-methods.js:24 ~ data=data.forEach ~ extracted_data:", extracted_data)
        return extracted_data
    })
    return data
}
