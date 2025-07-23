export const formattedTitle = (taskTitle: string) => {
  if (taskTitle.length > 40) {
    return `${taskTitle.substring(0, 40)} ...`;
  }
  return taskTitle;
};

export const priorityColor = (priority: string) => {
  if (priority === "high") {
    return "bg-red-500";
  } else if (priority === "medium") {
    return "bg-yellow-500";
  } else if (priority === "low") {
    return "bg-green-500";
  }
};

export const deadlineColor = (deadline: string) => {
  const maintenant = new Date();
  const deadlineDate = new Date(deadline);
  const diffMs = deadlineDate.getTime() - maintenant.getTime();
  const isInThreeDays = diffMs < 3 * 24 * 60 * 60 * 1000;
  if (isInThreeDays) {
    return "bg-red-500";
  } else {
    return "bg-green-500 text-white";
  }
};
