import React, { useState } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles';
import { forumService } from '../services';

const CreatePostScreen = ({ navigation, route }) => {
  const { onPostCreated } = route.params || {};
  
  const [selectedCategory, setSelectedCategory] = useState('discussion');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'tips', label: 'Tips & Tricks', icon: 'bulb-outline', color: theme.colors.success },
    { id: 'questions', label: 'Q&A', icon: 'help-circle-outline', color: theme.colors.info },
    { id: 'showcase', label: 'Showcase', icon: 'image-outline', color: theme.colors.warning },
    { id: 'discussion', label: 'Discussion', icon: 'chatbubbles-outline', color: theme.colors.primary },
  ];

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for your post.');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Missing Content', 'Please write something in your post.');
      return;
    }

    if (title.length < 5) {
      Alert.alert('Title Too Short', 'Title must be at least 5 characters long.');
      return;
    }

    if (content.length < 10) {
      Alert.alert('Content Too Short', 'Content must be at least 10 characters long.');
      return;
    }

    setLoading(true);

    try {
      // Parse tags
      const tagArray = tags
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag.length > 0)
        .slice(0, 5); // Max 5 tags

      const postData = {
        category: selectedCategory,
        title: title.trim(),
        content: content.trim(),
        tags: tagArray,
      };

      const response = await forumService.createPost(postData);

      if (response.success) {
        Alert.alert(
          'Success!',
          'Your post has been created successfully.',
          [
            {
              text: 'OK',
              onPress: () => {
                if (onPostCreated) {
                  onPostCreated();
                }
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to create post. Please try again.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Post</Text>
          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Text style={styles.submitButtonText}>Post</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Category Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Category *</Text>
            <Text style={styles.hint}>Choose the best category for your post</Text>
            <View style={styles.categoriesGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryCard,
                    selectedCategory === category.id && {
                      borderColor: category.color,
                      backgroundColor: category.color + '10',
                    },
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={category.icon}
                    size={28}
                    color={selectedCategory === category.id ? category.color : theme.colors.text.secondary}
                  />
                  <Text
                    style={[
                      styles.categoryLabel,
                      selectedCategory === category.id && { color: category.color },
                    ]}
                  >
                    {category.label}
                  </Text>
                  {selectedCategory === category.id && (
                    <View style={[styles.selectedBadge, { backgroundColor: category.color }]}>
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Title Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Title *</Text>
            <Text style={styles.hint}>Make it clear and descriptive</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="e.g., Best practices for hand pollination"
              placeholderTextColor={theme.colors.text.secondary}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
              multiline
            />
            <Text style={styles.charCount}>{title.length}/100</Text>
          </View>

          {/* Content Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Content *</Text>
            <Text style={styles.hint}>Share your knowledge, question, or experience</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="Write your post content here..."
              placeholderTextColor={theme.colors.text.secondary}
              value={content}
              onChangeText={setContent}
              maxLength={2000}
              multiline
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{content.length}/2000</Text>
          </View>

          {/* Tags Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Tags (Optional)</Text>
            <Text style={styles.hint}>Add up to 5 tags, separated by commas</Text>
            <TextInput
              style={styles.tagsInput}
              placeholder="e.g., pollination, tips, harvest"
              placeholderTextColor={theme.colors.text.secondary}
              value={tags}
              onChangeText={setTags}
              autoCapitalize="none"
            />
            {tags.trim() && (
              <View style={styles.tagsPreview}>
                {tags.split(',').filter(t => t.trim()).slice(0, 5).map((tag, index) => (
                  <View key={index} style={styles.tagChip}>
                    <Text style={styles.tagChipText}>#{tag.trim().toLowerCase()}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Guidelines */}
          <View style={styles.guidelinesBox}>
            <Ionicons name="information-circle-outline" size={20} color={theme.colors.info} />
            <View style={styles.guidelinesContent}>
              <Text style={styles.guidelinesTitle}>Posting Guidelines</Text>
              <Text style={styles.guidelinesText}>
                • Be respectful and constructive{'\n'}
                • Keep content relevant to gourd growing{'\n'}
                • Avoid spam or self-promotion{'\n'}
                • Use appropriate category
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background.secondary,
    backgroundColor: theme.colors.surface,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
  },
  submitButton: {
    width: 60,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  hint: {
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  categoryCard: {
    width: '48%',
    aspectRatio: 1.2,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 2,
    borderColor: theme.colors.background.secondary,
    padding: theme.spacing.md,
    margin: 6,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  categoryLabel: {
    fontSize: 13,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.background.secondary,
    padding: theme.spacing.md,
    fontSize: 15,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.primary,
    minHeight: 60,
    maxHeight: 100,
  },
  contentInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.background.secondary,
    padding: theme.spacing.md,
    fontSize: 15,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.primary,
    minHeight: 200,
    maxHeight: 300,
  },
  tagsInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.background.secondary,
    padding: theme.spacing.md,
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.primary,
    height: 48,
  },
  charCount: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    textAlign: 'right',
    marginTop: 4,
  },
  tagsPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.sm,
  },
  tagChip: {
    backgroundColor: theme.colors.primary + '15',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  tagChipText: {
    fontSize: 12,
    fontFamily: theme.fonts.medium,
    color: theme.colors.primary,
  },
  guidelinesBox: {
    flexDirection: 'row',
    backgroundColor: theme.colors.info + '10',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.info + '30',
  },
  guidelinesContent: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  guidelinesTitle: {
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  guidelinesText: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
});

CreatePostScreen.routeName = 'CreatePost';
export default CreatePostScreen;
