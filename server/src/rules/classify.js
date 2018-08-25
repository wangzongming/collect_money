export const classifyUpdate = [
  {
    field: "classifyName",
    rules: [
      {
        require: true,
        message: "分类名必填"
      }
    ]
  },
  {
    field: "classifyId",
    rules: [
      {
        require: true,
        message: "classifyId必传"
      }
    ]
  }
];

export const classifyAdd = [
  {
    field: "classifyName",
    rules: [
      {
        require: true,
        message: "分类名必填"
      }
    ]
  }
];
