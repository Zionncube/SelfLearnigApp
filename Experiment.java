import java .time.LocalDate;


public class Experiment implements java.io.Serializable {
    private static final long serialVersionUID = 1L;
    private int id;
    private String strategy;
    private String experiment;
    private String prediction;
    private String results;
    private LocalDate date;

    public Experiment(
        int id,
        String strategy,
        String experiment,
        String results,
        LocalDate date
    ){
        this.id = id;
        this.strategy = strategy;
        this.experiment = experiment;
        this.results = results;
        this.date = date;
    }

    public Experiment(int id, String strategy, String experiment, String prediction, String results, LocalDate date) {
        this(id, strategy, experiment, results, date);
        this.prediction = prediction;
    }

    public String getStrategy() { return strategy; }
    public String getExperiment() { return experiment; }
    public String getPrediction() { return prediction; }
    public String getResults() { return results; }
    public LocalDate getDate() { return date; }
}
