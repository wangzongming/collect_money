export const update = [
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
    field: "id",
    rules: [
      {
        require: true,
        message: "id必传"
      }
    ]
  }
];

export const add = [
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
