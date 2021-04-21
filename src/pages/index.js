import asyncImport from '../app/HOCs/asyncImport'

const TeacherPage = asyncImport(() => import('./Teacher'))
const StudentPage = asyncImport(() => import('./Student'))
const TopPage = asyncImport(() => import('./TopPage'))
const LiveRoom = asyncImport(() => import('./LiveRoom'))

export {
  TeacherPage,
  StudentPage,
  TopPage,
  LiveRoom
}
