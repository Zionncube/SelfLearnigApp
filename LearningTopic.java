public class LearningTopic {
    private int id;
    private String title;
    private String description;
    private String content;

    public LearningTopic (
        int id,
        String title,
        String description,
        String content
    ){
        this.id = id; 
        this.title = title;
        this.description = description;
        this.content = content;
    }

    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getContent() { return content; }
}
