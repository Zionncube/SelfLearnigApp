import java.util.ArrayList;
import java.util.List;

public class Learner implements java.io.Serializable {
    private static final long serialVersionUID = 1L;
    private int id;
    private String name;
    private int age;

    private Profile profile;

    private List<Observation> observations;
    private List<Experiment> experiments;
    private List<Reflection> reflections;
    private List<GratitudeEntry> gratitudeEntries;
    private EvaluationRecord evaluationRecord;
    private ResourceMap resourceMap;
    private boolean isiZulu;

    public Learner(int id, String name, int age){
        this.id = id;
        this.name = name;
        this.age = age;

        observations = new ArrayList<>();
        experiments = new ArrayList<>();
        reflections = new ArrayList<>();
        gratitudeEntries = new ArrayList<>();
    }

    public void addObservation(Observation observation){
        observations.add(observation);
    }

    public void addExperiment(Experiment experiment){
        experiments.add(experiment);
    }

    public void addReflection(Reflection reflection){
        reflections.add(reflection);
    }

    public void addGratitudeEntries(GratitudeEntry gratitudeEntry){
        gratitudeEntries.add(gratitudeEntry);
    }

    public int getId(){
        return id;
    }

    public String getName(){
        return name;
    }

    public int getAge(){
        return age;
    }

    public Profile getProfile(){
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }

    public EvaluationRecord getEvaluationRecord() {
        return evaluationRecord;
    }

    public void setEvaluationRecord(EvaluationRecord evaluationRecord) {
        this.evaluationRecord = evaluationRecord;
    }

    public ResourceMap getResourceMap() { return resourceMap; }

    public void setResourceMap(ResourceMap resourceMap) { this.resourceMap = resourceMap; }

    public boolean isIsiZulu() { return isiZulu; }

    public void setIsiZulu(boolean isiZulu) { this.isiZulu = isiZulu; }

    public List<Observation> getObservations(){
        return observations;
    }

    public List<Experiment> getExperiments(){
        return experiments;
    }

    public List<Reflection> getReflections(){
        return reflections;
    }

    public List<GratitudeEntry> getGratitudeEntries(){
        return gratitudeEntries;
    }

}
