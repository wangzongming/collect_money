export const add = [
  {
    field: "name",
    rules: [
      {
        require: true,
        message: "用户名必填"
      }
    ]
  }
];

export const update = [ 
  {
    field: "uid",
    rules: [
      {
        require: true,
        message: "uid必传"
      }
    ]
  }
];
export const del = [
  {
    field: "uid",
    rules: [
      {
        require: true,
        message: "uid必传"
      }
    ]
  }
];
