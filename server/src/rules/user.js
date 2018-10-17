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
    field: "id",
    rules: [
      {
        require: true,
        message: "id必传"
      }
    ]
  }
];
export const del = [
  {
    field: "id",
    rules: [
      {
        require: true,
        message: "id必传"
      }
    ]
  }
];
