<?php

/**
 * Dataset for user roles testing
 */
dataset('user_roles', [
    'student' => ['student'],
    'admin' => ['admin'],
    'osas_staff' => ['osas_staff'],
]);

/**
 * Dataset for non-student roles
 */
dataset('non_student_roles', [
    'admin' => ['admin'],
    'osas_staff' => ['osas_staff'],
]);

/**
 * Dataset for scholarship statuses
 */
dataset('scholarship_statuses', [
    'active' => ['active'],
    'inactive' => ['inactive'],
    'draft' => ['draft'],
    'expired' => ['expired'],
]);

/**
 * Dataset for scholarship application statuses
 */
dataset('application_statuses', [
    'draft' => ['draft'],
    'submitted' => ['submitted'],
    'under_review' => ['under_review'],
    'approved' => ['approved'],
    'rejected' => ['rejected'],
    'cancelled' => ['cancelled'],
]);
