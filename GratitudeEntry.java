import java .time.LocalDate;

public class GratitudeEntry implements java.io.Serializable {
    private static final long serialVersionUID = 1L;
    private int id;
    private String message;
    private LocalDate date;

    public GratitudeEntry(int id, String message, LocalDate date) {
        this.id = id;
        this.message = message;
        this.date = date;
    }

    public String getMessage() { return message; }
    public LocalDate getDate() { return date; }
}
