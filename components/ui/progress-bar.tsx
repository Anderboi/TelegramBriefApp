export const ProgressBar = ({ step, totalSteps }: { step: number, totalSteps: number }) => {
  return (
    <div
      className="progress-bar-container"
      style={{ display: "flex", marginBottom: 20 }}
    >
      {[...Array(totalSteps)].map((_, index) => (
        <div
          key={index}
          style={{
            flex: 1,
            height: 8,
            marginRight: index < totalSteps - 1 ? 8 : 0,
            borderRadius: 4,
            backgroundColor: index + 1 <= step ? "#242831" : "#e0e0e0",
            transition: "background-color 0.3s ease",
          }}
          title={`Шаг ${index + 1}`}
        />
      ))}
    </div>
  );
};
