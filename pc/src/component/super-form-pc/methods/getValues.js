const getValues = function(noVerify) {
  return new Promise((resole, reject) => {
    const { validateFieldsAndScroll, getFieldsValue } = this.props.form;
    if (noVerify) {
      resole(getFieldsValue());
    } else {
      validateFieldsAndScroll((err, values) => {
        if (!err) {
          resole(values);
        } else {
          resole(values);
        }
      });
    }
  });
};

export default getValues;
