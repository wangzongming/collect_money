const rules = [
    {
      field: "username",
      rules: [
        {
          require: true,
          message: "用户名为必填"
        } 
      ]
    },
    {
      field: "password",
      rules: [
        {
          require: true,
          message: "密码为必填"
        }
      ]
    }
  ];
  export default rules;