export default () => {
  const pickBy = (data: any) => {
    return JSON.parse(JSON.stringify(data, (_, value) => {
      if (
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return undefined
      }
      return value
    }))
  }

  return {
    pickBy
  }
}
