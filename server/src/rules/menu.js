export const add = [
  {
    field: "name",
    rules: [
      {
        require: true,
        message: "菜名必填"
      }
    ]
  },
  {
    field: "price",
    rules: [
      {
        require: true,
        message: "菜价必填"
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
