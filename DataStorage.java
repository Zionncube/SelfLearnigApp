import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;

public class DataStorage {
    private static final Path SAVE_FILE = Path.of("learner-data.ser");

    public static void saveLearner(Learner learner) {
        try (ObjectOutputStream output = new ObjectOutputStream(new FileOutputStream(SAVE_FILE.toFile()))) {
            output.writeObject(learner);
        } catch (IOException error) {
            System.out.println("Your information could not be saved: " + error.getMessage());
        }
    }

    public static Learner loadLearner() {
        if (!Files.exists(SAVE_FILE)) {
            return null;
        }

        try (ObjectInputStream input = new ObjectInputStream(new FileInputStream(SAVE_FILE.toFile()))) {
            return (Learner) input.readObject();
        } catch (IOException | ClassNotFoundException error) {
            System.out.println("Previous saved information could not be loaded.");
            return null;
        }
    }
}
