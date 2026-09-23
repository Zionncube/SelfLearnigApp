import java.io.Serializable;

public class ResourceMap implements Serializable {
    private static final long serialVersionUID = 1L;
    private String helpfulConditions;
    private String distractions;
    private String peopleAndTools;
    private String nextSupport;

    public ResourceMap(String helpfulConditions, String distractions, String peopleAndTools, String nextSupport) {
        this.helpfulConditions = helpfulConditions;
        this.distractions = distractions;
        this.peopleAndTools = peopleAndTools;
        this.nextSupport = nextSupport;
    }

    public String getHelpfulConditions() { return helpfulConditions; }
    public String getDistractions() { return distractions; }
    public String getPeopleAndTools() { return peopleAndTools; }
    public String getNextSupport() { return nextSupport; }
}
