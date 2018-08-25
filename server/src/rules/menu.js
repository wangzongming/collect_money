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
    field: "menuId",
    rules: [
      {
        require: true,
        message: "menuId必传"
      }
    ]
  } 
];
export const del = [
  {
    field: "menuId",
    rules: [
      {
        require: true,
        message: "menuId必传"
      }
    ]
  }
];
