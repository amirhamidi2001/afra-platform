"""
apps.teachers.pagination
~~~~~~~~~~~~~~~~~~~~~~~~~
Pagination classes for teacher discovery endpoints.
"""

from rest_framework.pagination import PageNumberPagination


class TeacherPageNumberPagination(PageNumberPagination):
    """
    Page-number pagination for teacher browse/search results.

    Offset pagination is appropriate here (unlike sessions which are
    time-ordered and use cursor pagination) because:
    - Teacher lists are sorted by rating and name — a stable ordering.
    - Clients need to know the total count to render page controls.
    - Teacher inserts are rare, so offset drift is not a concern.
    """

    page_size = 20
    max_page_size = 100
    page_size_query_param = "page_size"
    page_query_param = "page"
