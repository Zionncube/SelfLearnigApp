import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class ReportExporter {
    private static final Path REPORT_FILE = Path.of("learner-growth-report.txt");

    public static String export(Learner learner) throws IOException {
        StringBuilder report = new StringBuilder();
        report.append("SELF-LEARNING APP: GROWTH REPORT\n\n");
        report.append("Learner: ").append(learner.getName()).append("\n");
        report.append("Age: ").append(learner.getAge()).append("\n\n");
        report.append("Observations: ").append(learner.getObservations().size()).append("\n");
        report.append("Experiments: ").append(learner.getExperiments().size()).append("\n");
        report.append("Reflections: ").append(learner.getReflections().size()).append("\n");
        report.append("Gratitude entries: ").append(learner.getGratitudeEntries().size()).append("\n\n");

        if (!learner.getReflections().isEmpty()) {
            Reflection latest = learner.getReflections().get(learner.getReflections().size() - 1);
            report.append("Latest lesson learned: ").append(latest.getLessonLearned()).append("\n\n");
        }

        EvaluationRecord evaluation = learner.getEvaluationRecord();
        if (evaluation != null && evaluation.hasBeforeResponses()) {
            report.append("Before-use confidence: ").append(String.format("%.2f", evaluation.getBeforeAverage())).append(" / 5\n");
            if (evaluation.hasAfterResponses()) {
                report.append("After-use confidence: ").append(String.format("%.2f", evaluation.getAfterAverage())).append(" / 5\n");
                report.append("Change: ").append(String.format("%.2f", evaluation.getImprovement())).append(" points\n");
            }
        }
        Files.writeString(REPORT_FILE, report.toString());
        return REPORT_FILE.toAbsolutePath().toString();
    }
}
