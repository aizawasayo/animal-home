import {
  getOptionList
} from '@api/option'

export default function getOption(type, callback) {
  getOptionList({
    type
  }).then(res => {
    let optionList = res.data.map(item => {
      return {
        text: item.name,
        value: item.name
      }
    })
    callback(optionList)
  })
}
