import { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import TaskCard from '../components/TaskCard';

const TASKS_STORAGE_KEY = '@week1labs_tasks';

export default function AddTaskScreen() {
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Lab 9: Quote state
  const [quote, setQuote] = useState(
    "Loading today's motivation..."
  );

  // Load tasks from AsyncStorage
  useEffect(() => {
    loadTasks();
  }, []);

  // Save tasks to AsyncStorage
  useEffect(() => {
    saveTasks();
  }, [tasks]);

  // Lab 9: Fetch a quote when the screen loads
  useEffect(() => {
    fetch('https://api.quotable.io/random')
      .then((response) => response.json())
      .then((data) => setQuote(data.content))
      .catch(() =>
        setQuote('Believe in yourself and get it done!')
      );
  }, []);

  async function loadTasks() {
    try {
      const storedTasks = await AsyncStorage.getItem(
        TASKS_STORAGE_KEY
      );

      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.log('Failed to load tasks:', error);
    }
  }

  async function saveTasks() {
    try {
      await AsyncStorage.setItem(
        TASKS_STORAGE_KEY,
        JSON.stringify(tasks)
      );
    } catch (error) {
      console.log('Failed to save tasks:', error);
    }
  }

  function handleAddTask() {
    if (taskText.trim() === '') {
      setErrorMessage('Please type a task before adding it.');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: taskText,
      done: false,
    };

    setTasks([...tasks, newTask]);
    setTaskText('');
    setErrorMessage('');
  }

  function handleToggleTask(id) {
    setTasks(
      tasks.map((t) =>
        t.id === id
          ? { ...t, done: !t.done }
          : t
      )
    );
  }

  return (
    <View style={styles.container}>
      {/* Lab 9: Display quote */}
      <Text style={styles.quote}>
        💬 {quote}
      </Text>

      {/* Lab 9: New Quote button */}
      <Button
        title="New Quote"
        onPress={() => {
          fetch('https://api.quotable.io/random')
            .then((response) => response.json())
            .then((data) => setQuote(data.content))
            .catch(() =>
              setQuote(
                'Believe in yourself and get it done!'
              )
            );
        }}
      />

      <Text style={styles.heading}>Add a Task</Text>

      <TextInput
        style={styles.input}
        placeholder="What do you need to do?"
        value={taskText}
        onChangeText={setTaskText}
      />

      {errorMessage !== '' && (
        <Text style={styles.error}>
          {errorMessage}
        </Text>
      )}

      <Button
        title="Add Task"
        onPress={handleAddTask}
      />

      <Text style={styles.counter}>
        You have {tasks.length} task(s)
      </Text>

      {tasks.length > 0 &&
        tasks.every((t) => t.done) && (
          <Text style={styles.celebration}>
            🎉 All done! Great work!
          </Text>
        )}

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            title={item.title}
            done={item.done}
            onToggle={() => handleToggleTask(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No tasks yet — add one above! 👆
          </Text>
        }
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },

  // Lab 9: Quote styling
  quote: {
    fontStyle: 'italic',
    color: '#6B7280',
    marginBottom: 16,
    textAlign: 'center',
  },

  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: '#D8DEE9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },

  error: {
    color: '#B23A48',
    marginBottom: 10,
  },

  counter: {
    marginTop: 10,
    fontSize: 14,
    color: '#4B5563',
  },

  celebration: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E8A7A',
    textAlign: 'center',
    marginVertical: 12,
  },

  list: {
    marginTop: 16,
  },

  empty: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 24,
  },

  separator: {
    height: 8,
  },
});