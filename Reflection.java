import java .time.LocalDate;

public class Reflection implements java.io.Serializable {
    private static final long serialVersionUID = 1L;
    private int id;
    private String thoughts;
    private String feelings;
    private String lessonLearned;
    private LocalDate date;

    public Reflection (
        int id, 
        String thoughts,
        String feelings,
        String lessonLearned,
        LocalDate date
    ){
        this.id = id;
        this.thoughts = thoughts;
        this.feelings = feelings;
        this.lessonLearned = lessonLearned;
        this.date = date;
    }

    public String getThoughts() { return thoughts; }
    public String getFeelings() { return feelings; }
    public String getLessonLearned() { return lessonLearned; }
    public LocalDate getDate() { return date; }
}
