import java.io.Serializable;
import java.time.LocalDate;

public class EvaluationRecord implements Serializable {
    private static final long serialVersionUID = 1L;
    private int[] beforeResponses;
    private int[] afterResponses;
    private LocalDate beforeDate;
    private LocalDate afterDate;

    public void setBeforeResponses(int[] responses) {
        beforeResponses = responses;
        beforeDate = LocalDate.now();
    }

    public void setAfterResponses(int[] responses) {
        afterResponses = responses;
        afterDate = LocalDate.now();
    }

    public boolean hasBeforeResponses() { return beforeResponses != null; }
    public boolean hasAfterResponses() { return afterResponses != null; }
    public LocalDate getBeforeDate() { return beforeDate; }
    public LocalDate getAfterDate() { return afterDate; }

    public double getBeforeAverage() { return average(beforeResponses); }
    public double getAfterAverage() { return average(afterResponses); }

    public double getImprovement() {
        return hasBeforeResponses() && hasAfterResponses() ? getAfterAverage() - getBeforeAverage() : 0;
    }

    private double average(int[] responses) {
        if (responses == null || responses.length == 0) return 0;
        int total = 0;
        for (int response : responses) total += response;
        return (double) total / responses.length;
    }
}
