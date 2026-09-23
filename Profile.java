public class Profile implements java.io.Serializable {
    private static final long serialVersionUID = 1L;
    private String interests;
    private String strengths;
    private String challenges;
    private String learningEnvironment;
    private String goals;

    public Profile(String interests, String strengths, String challenges, String learningEnvironment, String goals) {
        this.interests = interests;
        this.strengths = strengths;
        this.challenges = challenges;
        this.learningEnvironment = learningEnvironment;
        this.goals = goals;
    }

    public String getInterests() { return interests; }
    public String getStrengths() { return strengths; }
    public String getChallenges() { return challenges; }
    public String getLearningEnvironment() { return learningEnvironment; }
    public String getGoals() { return goals; }
}
