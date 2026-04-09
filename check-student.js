const { Student } = require('./src/models');
const id = '08975b9b-ea56-4c67-8494-9cdab79d4e59';

async function check() {
    try {
        const student = await Student.findByPk(id);
        console.log('Student with ID:', id);
        if (student) {
            console.log('Found in DB:', JSON.stringify(student.toJSON(), null, 2));
            if (student.isDeleted) {
                console.log('NOTE: isDeleted is true');
            }
        } else {
            console.log('NOT FOUND in DB at all.');
        }
    } catch (err) {
        console.log('Error:', err);
    } finally {
        process.exit();
    }
}

check();
