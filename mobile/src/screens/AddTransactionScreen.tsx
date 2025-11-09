import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  Picker,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { createTransaction } from '../store/slices/transactionSlice';
import { TransactionType, TransactionCategory } from '@finance-app/shared';

const AddTransactionScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { accounts } = useSelector((state: RootState) => state.accounts);
  const { loading } = useSelector((state: RootState) => state.transactions);

  const [formData, setFormData] = useState({
    accountId: '',
    amount: '',
    type: TransactionType.EXPENSE,
    category: TransactionCategory.OTHER,
    description: '',
    isNeed: false,
    date: new Date().toISOString().split('T')[0],
  });

  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const categoryOptions = Object.values(TransactionCategory);
  const typeOptions = Object.values(TransactionType);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.accountId || !formData.amount || !formData.date) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await dispatch(createTransaction({
        accountId: formData.accountId,
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        description: formData.description || undefined,
        isNeed: formData.isNeed,
        date: new Date(formData.date),
      })).unwrap();

      // Reset form
      setFormData({
        accountId: '',
        amount: '',
        type: TransactionType.EXPENSE,
        category: TransactionCategory.OTHER,
        description: '',
        isNeed: false,
        date: new Date().toISOString().split('T')[0],
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to create transaction:', error);
      Alert.alert('Error', 'Failed to create transaction');
    }
  };

  const getSelectedAccountName = () => {
    const account = accounts.find(acc => acc.id === formData.accountId);
    return account ? `${account.name} (${account.type})` : 'Select an account';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Add Transaction</Text>
      
      {showSuccess && (
        <View style={styles.successMessage}>
          <Text style={styles.successText}>Transaction added successfully!</Text>
        </View>
      )}

      {/* Account Selection */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Account *</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowAccountPicker(true)}
        >
          <Text style={styles.pickerText}>
            {getSelectedAccountName()}
          </Text>
          <Text style={styles.pickerArrow}>▼</Text>
        </TouchableOpacity>
      </View>

      {/* Amount */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Amount *</Text>
        <TextInput
          style={styles.input}
          value={formData.amount}
          onChangeText={(value) => handleInputChange('amount', value)}
          placeholder="0.00"
          keyboardType="decimal-pad"
        />
      </View>

      {/* Transaction Type */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Type</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowTypePicker(true)}
        >
          <Text style={styles.pickerText}>
            {formData.type.charAt(0) + formData.type.slice(1).toLowerCase()}
          </Text>
          <Text style={styles.pickerArrow}>▼</Text>
        </TouchableOpacity>
      </View>

      {/* Category */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Category</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowCategoryPicker(true)}
        >
          <Text style={styles.pickerText}>
            {formData.category.charAt(0) + formData.category.slice(1).toLowerCase()}
          </Text>
          <Text style={styles.pickerArrow}>▼</Text>
        </TouchableOpacity>
      </View>

      {/* Need vs Want Classification */}
      {formData.type === TransactionType.EXPENSE && (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Classification *</Text>
          <TouchableOpacity
            style={[
              styles.classificationButton,
              formData.isNeed && styles.selectedClassification,
              { backgroundColor: formData.isNeed ? '#DBEAFE' : '#F3F4F6' }
            ]}
            onPress={() => handleInputChange('isNeed', true)}
          >
            <View style={styles.radioButton}>
              <View style={[styles.radioCircle, formData.isNeed && styles.radioSelected]} />
            </View>
            <View style={styles.classificationContent}>
              <Text style={[styles.classificationTitle, { color: formData.isNeed ? '#2563EB' : '#6B7280' }]}>
                Need
              </Text>
              <Text style={styles.classificationDescription}>
                Essential expense (rent, groceries, utilities, etc.)
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.classificationButton,
              !formData.isNeed && styles.selectedClassification,
              { backgroundColor: !formData.isNeed ? '#F3E8FF' : '#F3F4F6' }
            ]}
            onPress={() => handleInputChange('isNeed', false)}
          >
            <View style={styles.radioButton}>
              <View style={[styles.radioCircle, !formData.isNeed && styles.radioSelected]} />
            </View>
            <View style={styles.classificationContent}>
              <Text style={[styles.classificationTitle, { color: !formData.isNeed ? '#9333EA' : '#6B7280' }]}>
                Want
              </Text>
              <Text style={styles.classificationDescription}>
                Optional expense (dining, entertainment, shopping, etc.)
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Description */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(value) => handleInputChange('description', value)}
          placeholder="Optional description..."
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Date */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Date *</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.pickerText}>{formData.date}</Text>
          <Text style={styles.pickerArrow}>▼</Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Adding Transaction...' : 'Add Transaction'}
        </Text>
      </TouchableOpacity>

      {/* Modals */}
      <Modal visible={showAccountPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Account</Text>
            <ScrollView>
              {accounts.map(account => (
                <TouchableOpacity
                  key={account.id}
                  style={styles.modalOption}
                  onPress={() => {
                    handleInputChange('accountId', account.id);
                    setShowAccountPicker(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>
                    {account.name} ({account.type}) - ${account.balance.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowAccountPicker(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showTypePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Type</Text>
            {typeOptions.map(type => (
              <TouchableOpacity
                key={type}
                style={styles.modalOption}
                onPress={() => {
                  handleInputChange('type', type);
                  setShowTypePicker(false);
                }}
              >
                <Text style={styles.modalOptionText}>
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowTypePicker(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showCategoryPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <ScrollView>
              {categoryOptions.map(category => (
                <TouchableOpacity
                  key={category}
                  style={styles.modalOption}
                  onPress={() => {
                    handleInputChange('category', category);
                    setShowCategoryPicker(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>
                    {category.charAt(0) + category.slice(1).toLowerCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowCategoryPicker(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  successMessage: {
    backgroundColor: '#D1FAE5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    color: '#065F46',
    textAlign: 'center',
    fontWeight: '500',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 16,
    color: '#111827',
  },
  pickerArrow: {
    fontSize: 12,
    color: '#6B7280',
  },
  classificationButton: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: 12,
    alignItems: 'center',
  },
  selectedClassification: {
    borderColor: '#3B82F6',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
  },
  radioSelected: {
    backgroundColor: '#3B82F6',
  },
  classificationContent: {
    flex: 1,
  },
  classificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  classificationDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#111827',
  },
  modalCloseButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  modalCloseText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
});

export default AddTransactionScreen;