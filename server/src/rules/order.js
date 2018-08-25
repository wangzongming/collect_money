export const add = [
  {
    field: "menuId",
    rules: [
      {
        require: true,
        message: "menuId必传"
      }
    ]
  },
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

export const update = [
  {
    field: "orderId",
    rules: [
      {
        require: true,
        message: "orderId必传"
      }
    ]
  } 
];
export const del = [
  {
    field: "orderId",
    rules: [
      {
        require: true,
        message: "orderId必传"
      }
    ]
  }
];
