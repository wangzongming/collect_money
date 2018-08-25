export const add = [
  {
    field: "uid",
    rules: [
      {
        require: true,
        message: "uid必传"
      }
    ]
  },
  {
    field: "money",
    rules: [
      {
        require: true,
        message: "money必填"
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
