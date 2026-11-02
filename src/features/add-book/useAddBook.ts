import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { booksApi } from '@/lib/api/books';
import { recommendationsApi } from '@/lib/api/recommendations';
import { useLikedCount } from '@/lib/likedCount';
import { emptyBookForm, toCreateBookRequest, validateBookForm } from './bookForm';
import type { AddedBook, BookForm, BookFormErrors } from './types';

export const useAddBook = () => {
  const { add } = useLikedCount();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BookForm>(emptyBookForm);
  const [errors, setErrors] = useState<BookFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<AddedBook | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const field = e.target.name as keyof BookForm;
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors = validateBookForm(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setSubmitError('Confira os campos marcados e tente de novo.');
      return;
    }

    setLoading(true);

    const response = await booksApi.create(toCreateBookRequest(formData));

    if (response.success) {
      const likeResponse = await recommendationsApi.accept(response.data.id);
      if (likeResponse.success) {
        add(1);
      } else {
        console.warn('Error adding to favorites:', likeResponse.error);
      }
      setResult({ title: formData.title, inFavorites: likeResponse.success });
      setFormData(emptyBookForm);
    } else {
      setSubmitError(response.error || 'Não deu para adicionar o livro. Tente de novo.');
    }

    setLoading(false);
  };

  const addAnother = () => {
    setResult(null);
    window.scrollTo({ top: 0 });
  };

  return {
    formData,
    errors,
    submitError,
    loading,
    result,
    handleInputChange,
    handleSubmit,
    addAnother,
  };
};
