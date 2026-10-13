<?php

namespace App\Enums;

enum PermissionName: string
{
    case CreateTickets = 'create tickets';
    case ViewOwnTickets = 'view own tickets';
    case ReplyToTickets = 'reply to tickets';
    case ViewTicketQueue = 'view ticket queue';
    case ClaimTickets = 'claim tickets';
    case ChangeTicketStatus = 'change ticket status';
    case ViewAllTickets = 'view all tickets';
    case AssignTickets = 'assign tickets';
    case ManageUsers = 'manage users';
}
