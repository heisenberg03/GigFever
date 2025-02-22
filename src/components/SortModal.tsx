import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface SortModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectSort: (criteria: 'averageRating' | 'popularity' | 'budget') => void;
    currentSort: 'averageRating' | 'popularity' | 'budget' | '';
}

const sortOptions: Array<{ label: string; value: 'averageRating' | 'popularity' | 'budget' }> = [
    { label: 'Rating', value: 'averageRating' },
    { label: 'Popularity', value: 'popularity' },
    { label: 'Budget', value: 'budget' },
];

const SortModal: React.FC<SortModalProps> = ({ visible, onClose, onSelectSort, currentSort }) => {
    const [selectedSort, setSelectedSort] = useState<'averageRating' | 'popularity' | 'budget' | ''>(currentSort);
    const theme = useTheme();

    useEffect(() => {
        if (visible) {
            setSelectedSort(currentSort);
            onClose();
        }
    }, [currentSort]);

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
                    <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Sort Artists</Text>

                    {sortOptions.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[styles.optionButton, selectedSort === option.value && { backgroundColor: theme.colors.primary }]}
                            onPress={() => onSelectSort(option.value)}
                        >
                            <Text style={[styles.optionText, selectedSort === option.value && { color: '#fff' }]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <View style={styles.buttonRow}>

                        <TouchableOpacity onPress={onClose} style={[styles.button, { backgroundColor: theme.colors.border }]}>
                            <Text style={{ color: theme.colors.text }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        borderRadius: 8,
        padding: 16,
    },
    modalTitle: {
        padding: 10,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        marginLeft: 10,
        textAlign: 'center',
    },
    optionButton: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#eee',
        borderRadius: 5,
    },
    optionText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
    selectedText: {
        fontWeight: 'bold',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
    },
    button: {
        padding: 12,
        marginBottom: 16,
        borderRadius: 8,
        width: '20%',
        alignItems: 'center',
    },
});

export default SortModal;
